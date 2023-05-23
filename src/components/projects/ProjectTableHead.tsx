const ProjectTableHead: React.FC<{}> = () => {
  /*    style={{gridTemplateColumns: 'minmax(0, 1fr) 2fr repeat(4, minmax(0, 1fr))'}}>*/
  return (
    <li
      className="p-3 grid gap-4 border-2 border-blue-500"
      style={{
        gridTemplateColumns:
          "minmax(0, 0.3fr) repeat(4, minmax(0, 2fr)) repeat(3, minmax(0, 0.7fr))",
      }}
    >
      <div>
        <span className="p-1">Id</span>
      </div>
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
