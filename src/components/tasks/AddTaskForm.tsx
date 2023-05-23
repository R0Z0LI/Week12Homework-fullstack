import { ChangeEvent, useRef, useState } from "react";
import { NewProject } from "../../model/newProject";
import { NewTask } from "../../model/newTask";
import { NewUser } from "../../model/newUser";
import { Project } from "../../model/project";
import { TaskStatus } from "../../model/task";
import { User } from "../../model/user";
import { ProjectStatus } from "../../utils/utils";

const AddTaskForm: React.FC<{
  onSubmit: (task: NewTask) => void;
  onClose: () => void;
  users: User[];
  projects: Project[];
}> = (props) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);
  const userInputRef = useRef<HTMLSelectElement>(null);
  const projectInputRef = useRef<HTMLSelectElement>(null);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const name = nameInputRef.current?.value;
    const description = descInputRef.current?.value;
    const userValue = userInputRef.current?.value;
    const userArray = userValue?.split(" ");

    const userId = userArray ? +userArray[0] : undefined;
    const projectValue = projectInputRef.current?.value;
    const projectArray = projectValue?.split(" ");
    const projectId = projectArray ? +projectArray[0] : undefined;
    const status: TaskStatus = TaskStatus.TODO;

    const user = props.users.find((item) => item.id === userId);
    const project = props.projects.find((item) => item.id === projectId);
    console.log(project);
    const isArchived = false;

    const newTask: NewTask = {
      name,
      description,
      isArchived,
      status,
      user,
      project,
    };
    props.onSubmit(newTask);
  };

  return (
    <div className="flex justify-end pr-6 ">
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
        <form className="p-2" onSubmit={onSubmitHandler}>
          <div className="w-fill flex justify-end">
            <button
              className="text-white text-xl"
              onClick={() => props.onClose()}
            >
              X
            </button>
          </div>
          <div>
            <div className="w-[400px] bg-white p-2 rounded-md">
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
                />
              </div>
              <div className="flex flex-col p-2">
                <label htmlFor="roles" className="pb-1 ">
                  User
                </label>
                <select name="roles" id="roles" ref={userInputRef}>
                  {props.users.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id} {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col p-2">
                <label htmlFor="roles" className="pb-1 ">
                  Project
                </label>
                <select name="roles" id="roles" ref={projectInputRef}>
                  {props.projects.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id} {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col p-2"></div>
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

export default AddTaskForm;
