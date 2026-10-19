# ruff: noqa: PT009, PT027
"""Regression tests for configuration and preflight before database reset."""

import importlib
import os
import unittest
from contextlib import ExitStack
from unittest.mock import Mock, patch

from clients._api_client import ApiClient
from clients._s3_client import S3Client

population = importlib.import_module("deserializer.main")


class S3ConfigurationTests(unittest.TestCase):
    """Local URLs and legacy hostnames keep their intended transport."""

    def test_local_and_legacy_endpoints(self) -> None:
        """Only explicit HTTP disables TLS; the legacy bucket stays default."""
        for endpoint, bucket, secure in [
            ("http://localhost:9000", "maps", False),
            ("s3.example.com", "cmumaps", True),
            ("https://s3.example.com/", "cmumaps", True),
        ]:
            with (
                self.subTest(endpoint=endpoint),
                patch.dict(
                    os.environ,
                    {"S3_ENDPOINT": endpoint, "S3_BUCKET": bucket},
                    clear=True,
                ),
                patch("clients._s3_client.Minio") as minio,
            ):
                client = S3Client()
                self.assertEqual(client.bucket_name, bucket)
                self.assertEqual(minio.call_args.kwargs["secure"], secure)
        with patch.dict(os.environ, {"S3_ENDPOINT": "s3.example.com"}, clear=True):
            self.assertEqual(S3Client().bucket_name, "cmumaps")

    def test_invalid_endpoint(self) -> None:
        """Reject URLs that would silently discard paths or credentials."""
        for endpoint in [
            "ftp://localhost",
            "https://s3.example.com/bucket",
            "http://user:pass@localhost",
        ]:
            with (
                self.subTest(endpoint=endpoint),
                patch.dict(
                    os.environ,
                    {"S3_ENDPOINT": endpoint},
                    clear=True,
                ),
                self.assertRaises(ValueError),
            ):
                S3Client()

    def test_cached_snapshot_and_response_cleanup(self) -> None:
        """Imports reuse the checked bytes instead of refetching changing objects."""
        with (
            patch.dict(os.environ, {"S3_ENDPOINT": "localhost:9000"}, clear=True),
            patch(
                "clients._s3_client.Minio",
            ) as minio,
        ):
            response = minio.return_value.get_object.return_value
            response.read.return_value = b'{"sample": {"value": 1}}'
            client = S3Client()
            data = client.preload_json_file("sample.json")
            self.assertIs(client.get_json_file("sample.json"), data)
            minio.return_value.get_object.assert_called_once()
            response.close.assert_called_once()
            response.release_conn.assert_called_once()


class PopulationTests(unittest.TestCase):
    """Failures must stop before reset, and reset failure must stop writes."""

    def setUp(self) -> None:
        """Replace clients and table population with isolated mocks."""
        self.api = Mock()
        self.api.drop_tables.return_value = True
        stack = ExitStack()
        self.addCleanup(stack.close)
        stack.enter_context(patch("sys.argv", ["populate-database", "--skip-pois"]))
        self.mocks = [
            stack.enter_context(
                patch.object(
                    population,
                    "get_api_client_singleton",
                    return_value=self.api,
                ),
            ),
            stack.enter_context(patch.object(population, "validate_sources")),
            stack.enter_context(patch.object(population, "populate_table")),
        ]

    def test_missing_or_invalid_source_prevents_reset(self) -> None:
        """Input failure prevents any backend mutation."""
        self.mocks[1].side_effect = ValueError("missing source")
        with self.assertRaises(ValueError):
            population.main()
        self.api.drop_tables.assert_not_called()
        self.mocks[2].assert_not_called()

    def test_auth_failure_prevents_reset(self) -> None:
        """An unauthorized client cannot trigger population."""
        self.api.preflight.side_effect = RuntimeError("unauthorized")
        with self.assertRaises(RuntimeError):
            population.main()
        self.api.drop_tables.assert_not_called()
        self.mocks[2].assert_not_called()

    def test_failed_reset_prevents_population(self) -> None:
        """Do not append data after the reset is rejected."""
        self.api.drop_tables.return_value = False
        with self.assertRaises(RuntimeError):
            population.main()
        self.mocks[2].assert_not_called()

    def test_check_never_resets(self) -> None:
        """Check mode authenticates but stops before writes."""
        with patch("sys.argv", ["populate-database", "--check", "--skip-pois"]):
            population.main()
        self.api.preflight.assert_called_once()
        self.api.drop_tables.assert_not_called()
        self.mocks[2].assert_not_called()

    def test_explicit_poi_skip(self) -> None:
        """The local archive can import with POIs deliberately omitted."""
        population.main()
        self.mocks[1].assert_called_once_with(skip_pois=True)
        self.api.drop_tables.assert_called_once_with(population.ALL_TABLE_NAMES)
        self.assertEqual(
            [call.args[0] for call in self.mocks[2].call_args_list],
            ["Building", "Floor", "Room", "Alias", "Node", "Edge"],
        )

    def test_pois_required_by_default(self) -> None:
        """The general importer continues requiring the POI source by default."""
        with patch("sys.argv", ["populate-database"]):
            population.main()
        self.mocks[1].assert_called_once_with(skip_pois=False)
        self.assertEqual(self.mocks[2].call_args.args[0], "Poi")


class AuthorizationTests(unittest.TestCase):
    """Probe the actual protected route with an empty batch."""

    def test_preflight_uses_empty_batch(self) -> None:
        """No rows are created to test credentials and server authorization."""
        with (
            patch.dict(
                os.environ,
                {
                    "SERVER_URL": "http://localhost/",
                    "AUTH_CLIENT_ID": "test",
                    "AUTH_CLIENT_SECRET": "test",
                    "AUTH_ISSUER": "https://idp.example/realm",
                },
                clear=True,
            ),
            patch.object(ApiClient, "_get_token", return_value="test"),
            patch(
                "clients._api_client.requests.post",
            ) as post,
        ):
            post.return_value.status_code = 200
            client = ApiClient()
            client.preflight()
            self.assertEqual(
                post.call_args.args[0],
                "http://localhost/populate-table/building",
            )
            self.assertEqual(post.call_args.kwargs["json"], [])
            self.assertEqual(
                client.token_url,
                "https://idp.example/realm/protocol/openid-connect/token",
            )


class LocalTargetTests(unittest.TestCase):
    """Local mode never adopts a remote endpoint from a dotenv file."""

    def test_local_mode_rejects_remote_storage(self) -> None:
        """A local run must not use a production storage destination."""
        with (
            patch.dict(
                os.environ,
                {
                    "S3_ENDPOINT": "https://s3.example.com",
                    "S3_BUCKET": "maps",
                },
                clear=True,
            ),
            patch.object(
                population.dotenv,
                "dotenv_values",
                return_value={
                    "AUTH_CLIENT_ID": "test",
                    "AUTH_CLIENT_SECRET": "test",
                    "AUTH_ISSUER": "https://idp.example/realm",
                },
            ),
            self.assertRaises(ValueError),
        ):
            population.configure_local()

    def test_local_mode_forces_backend_and_loads_only_auth(self) -> None:
        """Old remote backend settings cannot redirect a local reset."""
        with (
            patch.dict(
                os.environ,
                {
                    "S3_ENDPOINT": "http://localhost:9000",
                    "S3_BUCKET": "maps",
                    "SERVER_URL": "https://remote.example.com",
                },
                clear=True,
            ),
            patch.object(
                population.dotenv,
                "dotenv_values",
                return_value={
                    "AUTH_CLIENT_ID": "test",
                    "AUTH_CLIENT_SECRET": "test",
                    "AUTH_ISSUER": "https://idp.example/realm",
                    "SERVER_URL": "https://remote.example.com",
                    "UNRELATED": "ignored",
                },
            ),
        ):
            population.configure_local()
            self.assertEqual(os.environ["SERVER_URL"], "http://localhost")
            self.assertNotIn("UNRELATED", os.environ)
