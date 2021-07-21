import Link from 'next/link'
import styled from 'styled-components'
import { Project } from "@prisma/client"

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
        {projects.map(project => (
          <tr key={project.id}>
            <td>
              <Link href={`/projects/${project.id}`} passHref>
                <Anchor>{project.name}</Anchor>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
};

export default ProjectsTable;
