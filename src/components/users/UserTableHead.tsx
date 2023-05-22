const TableHead: React.FC<{}> = () => {
  /*    style={{gridTemplateColumns: 'minmax(0, 1fr) 2fr repeat(4, minmax(0, 1fr))'}}>*/
  return (
    <li
      className="p-3 grid gap-4 border-2 border-black"
      style={{
        gridTemplateColumns: "minmax(0, 1fr) 2fr repeat(5, minmax(0, 2fr))",
      }}
    >
      <div>
        <span className="p-1">Id</span>
      </div>
      <div>
        <span className="p-1">Name</span>
      </div>
      <div>
        <span className="p-1">Email</span>
      </div>
      <div>
        <span className="p-1">Role</span>
      </div>
      <div>
        <span className="p-1">Status</span>
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

export default TableHead;
