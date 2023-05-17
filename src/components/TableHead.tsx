const TableHead: React.FC<{}> = () => {
  return (
    <li className="p-3 grid gap-4 grid-cols-6 border-2 border-black">
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
    </li>
  );
};

export default TableHead;
