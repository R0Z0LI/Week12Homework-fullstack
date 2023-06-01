import { useEffect, useRef, useState } from "react";
import { NewProject } from "../../model/newProject";
import { Project } from "../../model/project";
import { User } from "../../model/user";
import { ProjectStatus } from "../../utils/utils";

const ProjectForm: React.FC<{
  onSubmit: (project: NewProject, users?: User[]) => void;
  onClose: () => void;
  items: User[];
  project?: Project;
}> = (props) => {
  const [project, setProject] = useState(props.project);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);
  const managerInputRef = useRef<HTMLSelectElement>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    if (props.project) {
      setSelectedUsers(props.project.users || []);
    }
  }, [props.project]);

  const checkboxChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const userId = event.target.value;
    const user = props.items.find((user) => user.id === userId);

    if (event.target.checked && user) {
      setSelectedUsers((prevUsers) => [...prevUsers, user]);
    } else {
      setSelectedUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    }
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const name = nameInputRef.current?.value;
    const description = descInputRef.current?.value;
    const managerValue = managerInputRef.current?.value;
    const managerArray = managerValue?.split(" ");

    const managerId = managerArray ? managerArray[0] : undefined;
    const status: ProjectStatus = ProjectStatus.ACTIVE;
    const manager = props.items.find((item) => item.id === managerId);
    const isArchived = false;

    const newProject: Project = {
      name,
      description,
      isArchived,
      status,
      manager,
      users: selectedUsers,
    };
    props.onSubmit(newProject, selectedUsers);
  };

  return (
    <div className="flex justify-end pr-6 ">
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
        <form className="p-2" onSubmit={onSubmitHandler}>
          <div className="w-fill flex justify-end">
            <button
              className="text-black text-xl"
              onClick={() => props.onClose()}
            >
              X
            </button>
          </div>
          <div>
            <div className="md:w-[400px] bg-white p-2 rounded-md">
              <div className="flex flex-col p-2">
                <label htmlFor="name" className="pb-1 ">
                  Name
                </label>
                <input
                  className="border-2 border-black w-60 rounded-lg p-1 "
                  type="string"
                  required
                  id="name"
                  ref={nameInputRef}
                  defaultValue={project === undefined ? "" : project?.name}
                />
              </div>
              <div className="flex flex-col p-2">
                <label htmlFor="email" className="pb-1 ">
                  Description
                </label>
                <input
                  className="border-2 border-black w-60 rounded-lg p-1 "
                  type="string"
                  required
                  id="email"
                  ref={descInputRef}
                  defaultValue={
                    project === undefined ? "" : project?.description
                  }
                />
              </div>
              <div className="flex flex-col p-2">
                <label htmlFor="roles" className="pb-1 ">
                  Manager
                </label>
                <select
                  name="roles"
                  id="roles"
                  ref={managerInputRef}
                  defaultValue={
                    project === undefined ? "" : project?.manager?.id
                  }
                >
                  {props.items
                    .filter((item) => item.isAdmin)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col p-2">
                <label htmlFor="team" className="pb-1 ">
                  Users
                </label>
                <div style={{ height: "100px", overflowY: "auto" }}>
                  {props.items.map((item) => (
                    <div key={item.id}>
                      <input
                        type="checkbox"
                        id={`team-${item.id}`}
                        name="team"
                        value={item.id}
                        onChange={checkboxChangeHandler}
                        defaultChecked={
                          project === undefined
                            ? false
                            : project?.users!!.some(
                                (user) => user.id === item.id
                              )
                        }
                      />
                      <label htmlFor={`team-${item.id}`}>{item.name}</label>
                    </div>
                  ))}
                </div>
              </div>
              <button className="border-2 border-black rounded-lg m-2 p-1 ">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
