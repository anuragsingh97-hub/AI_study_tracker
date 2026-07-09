import useAuth from "../../hooks/useAuth";

const Navbar = () => {

  const { user } = useAuth();

  return (

    <header className="bg-slate-900 border-b border-slate-800 h-20 flex justify-between items-center px-8">

      <div>

        <h2 className="text-2xl font-bold text-white">

          Dashboard

        </h2>

      </div>

      <div className="flex items-center gap-4">

        <div className="text-right">

          <p className="text-white">

            {user?.name}

          </p>

          <p className="text-gray-400 text-sm">

            {user?.email}

          </p>

        </div>

        <img
          src={`https://ui-avatars.com/api/?name=${user?.name}`}
          className="w-12 h-12 rounded-full"
        />

      </div>

    </header>

  );
};

export default Navbar;