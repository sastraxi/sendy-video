import Link from "next/link";
import styled from "@emotion/styled";
import { Project } from "@prisma/client";

export type ProjectAndSubmissionCount = Project & {
  _count: {
    submissions: number;
  } | null;
};

export type PropTypes = {
  projects: ProjectAndSubmissionCount[];
};

const Anchor = styled.a`
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ProjectsTable = ({ projects }: PropTypes) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Submissions</th>
          <th>Size</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td>
              <Link href={`/projects/${project.id}`} passHref>
                <Anchor>{project.name}</Anchor>
              </Link>
            </td>
            <td>
              <span>{project._count!.submissions}</span>
            </td>
            <td></td>
            <td>
              {project.folderWebLink && (
                <Link href={project.folderWebLink} passHref>
                  <Anchor>Google Drive</Anchor>
                </Link>
              )}
              <br></br>
              <Link href={`/p/${project.magicCode}`} passHref>
                <Anchor>Submit...</Anchor>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectsTable;
