# How to Contribute to CMU Maps

## Did you find a bug?

- **Do not open up a GitHub issue if the bug is a security vulnerability
  in CMU Maps**, and instead send an email to [ops@scottylabs.org](mailto:ops@scottylabs.org).

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/ScottyLabs/cmumaps/issues).

- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/ScottyLabs/cmumaps/issues/new). Be sure to include a **title and clear description** and as much relevant information as possible.

## Do you have an idea for a new feature?

- **Ensure the feature was not already proposed** by searching on GitHub under [Issues](https://github.com/ScottyLabs/cmumaps/issues).

- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/ScottyLabs/cmumaps/issues/new). Be sure to include a **title and description** of the feature you want to add.

## Do you want to contribute to the design?

We use [Figma](https://www.figma.com/design/4hihRwPsE7JDWI21q72B03/CMU-Maps) for design.
If you are interested in contributing to the CMU Maps design, you can send a message
pining the design lead (Wunwan Boonsitanara) in the [CMU Maps Slack channel](https://github.com/ScottyLabs/cmumaps/wiki/Communication).

## Do you want to contribute to the codebase?

### Prerequisites

Because working on CMU Maps requires access to Carnegie Mellon University's campus data,
you need to have an [Andrew ID](https://www.cmu.edu/computing/services/security/identity-access/account/userid.html).

### Find an Issue

Start by lookging through the [open issues](https://github.com/ScottyLabs/cmumaps/issues)
to find something you are interested in working on. Please avoid picking issues
that are already assigned to someone.

- Look for issues labeled [**good first issue**](https://github.com/ScottyLabs/cmumaps/labels/good%20first%20issue).
  These are great entry points for new contributors.

- Use labels with the `scope:` prefix to match the part of the codebase you want to work on. Or use the
  views in the [CMU Maps project board](https://github.com/orgs/ScottyLabs/projects/11) to filter issues.

If you don’t see something that interests you, feel free to
[open a new issue](https://github.com/ScottyLabs/cmumaps/issues/new) with your idea.

Note that a new contributor won't be assigned to the issue until their PR is merged.
This helps keep issues open for others who might also want to work on them.

### Obtain Permission

Follow the instructions in [Governance](https://github.com/ScottyLabs/governance)
to add yourself as a [contributor](https://github.com/ScottyLabs/governance/blob/main/docs/contributors.md)
and join the [CMU Maps team](https://github.com/ScottyLabs/governance/blob/main/teams/cmumaps.toml)
as an applicant to obtain the necessary permissions.

When opening your Governance PR, make sure to
[link the corresponding CMU Maps issue](<https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/>).
Request the frontend lead (@luke992), the data lead (@ellylai), or the server lead (@JettChenT)
as the reviewer for your PR depending on the scope of the issue.
Request the tech director (@Yuxiang-Huang) as the reviewer if you are unsure who to request as a reviewer.

### Setup and Develop

After you are added to Governance as a CMU Maps applicant, you will have access to the applicants secrets.
Compared to a regular CMU Maps developer, you will **not** have access to an Apple MapKit token.
You will have read-only access to the CMU Maps S3 bucket.

Key Resources:

- [Setup](https://github.com/ScottyLabs/cmumaps/wiki/Setup) for setup instructions.
- [Style Guide](https://github.com/ScottyLabs/cmumaps/wiki/Style-Guide) for coding style.
- [Troubleshooting](https://github.com/ScottyLabs/cmumaps/wiki/Troubleshooting) for troubleshooting common issues, including precommit checks.

### Submit a Pull Request

Once you are ready, follow the instructions in [PR Review Process](https://github.com/ScottyLabs/cmumaps/wiki/PR-Review-Process).
Once your PR is merged and that you have also come to one ScottyLabs work session
(more info in the [Communication wiki page](https://github.com/ScottyLabs/cmumaps/wiki/Communication)),
you will be included as a CMU Maps developer in the
[CMU Maps team](https://github.com/ScottyLabs/governance/blob/main/teams/cmumaps.toml), **forever**!

## Do you have questions?

Ask any question in the [CMU Maps Slack channel](https://github.com/ScottyLabs/cmumaps/wiki/Communication)!

## Join Us! 🎉

CMU Maps is a volunteer effort. We encourage you to pitch in and join [the team](https://github.com/ScottyLabs/governance/blob/main/teams/cmumaps.toml)!

Thanks! :heart: :heart: :heart:

CMU Maps Team

### **Acknowledgments**

Sections of this document were adapted from the [Ruby on Rails contributing guide](https://github.com/rails/rails/blob/main/CONTRIBUTING.md).
