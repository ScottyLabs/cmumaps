import $rapi from "@/api/rustClient";
import type { NavPaths } from "@/types/navTypes";

const useNavPaths = (src: string | null, dst: string | null) => {
  const { data: navPaths } = $rapi.useQuery("get", "/path", {
    params: {
      query: {
        start:
          src && src !== "" && src !== "user" ? src : "40.444035,-79.94463",
        end: dst && dst !== "" && dst !== "user" ? dst : "40.444035,-79.94463",
      },
    },
    enabled: !!src && !!dst,
  }) as { data: NavPaths | undefined };

  return navPaths;
};

export default useNavPaths;
