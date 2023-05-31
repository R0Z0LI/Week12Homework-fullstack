const ProjectTableHead: React.FC<{}> = () => {
  return (
    <li
      className="p-3 grid gap-4 border-2 border-black"
      style={{
        gridTemplateColumns:
          "repeat(4, minmax(0, 2fr)) repeat(3, minmax(0, 0.7fr))",
      }}
    >
      <div>
        <span className="p-1">Name</span>
      </div>
      <div>
        <span className="p-1">Description</span>
      </div>
      <div>
        <span className="p-1">Status</span>
      </div>
      <div>
        <span className="p-1">Manager</span>
      </div>
      <div>
        <span className="p-1">Archive</span>
      </div>
      <div>
        <span className="p-1">Delete</span>
      </div>
      <div>
        <span className="p-1">Edit</span>
      </div>
    </li>
  );
};

export default ProjectTableHead;
