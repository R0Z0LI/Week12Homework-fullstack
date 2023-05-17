import { ChangeEvent, useRef, useState } from "react";
import Modal from "react-modal";
import { NewUser } from "../../model/newUser";
import { User } from "../../model/user";

const AddUserForm: React.FC<{
  onSubmit: (user: NewUser) => void;
}> = (props) => {
  const [showModal, setShowModal] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [isAdmin, setIsAdmi] = useState(false);

  const dropdownChangerHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "User") {
      setIsAdmi(false);
    } else {
      setIsAdmi(true);
    }
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const name = nameInputRef.current?.value;
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;
    const newUser: NewUser = { name, email, password, isAdmin };
    setShowModal(false);
    props.onSubmit(newUser);
  };

  return (
    <div className="flex justify-end pr-6 ">
      <button
        className="bg-blue-300 hover:bg-blue-200 rounded-lg p-2"
        onClick={() => setShowModal(true)}
      >
        Add User
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
          <form className="p-2" onSubmit={onSubmitHandler}>
            <button
              className="text-white text-xl"
              onClick={() => setShowModal(false)}
            >
              X
            </button>
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
                    Email
                  </label>
                  <input
                    className="border-2 border-black w-60 rounded-lg p-1 "
                    type="string"
                    required
                    id="email"
                    ref={emailInputRef}
                  />
                </div>
                <div className="flex flex-col p-2">
                  <label htmlFor="password" className="pb-1 ">
                    Password
                  </label>
                  <input
                    className="border-2 border-black w-60 rounded-lg p-1 "
                    type="password"
                    required
                    id="password"
                    ref={passwordInputRef}
                  />
                </div>
                <div className="flex flex-col p-2">
                  <label htmlFor="roles" className="pb-1 ">
                    Role
                  </label>
                  <select
                    name="roles"
                    id="roles"
                    onChange={dropdownChangerHandler}
                    value="User"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <button className="border-2 border-black rounded-lg m-2 p-1 ">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddUserForm;
