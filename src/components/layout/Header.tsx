// import { Logout } from "@mui/icons-material";
import { NavLink } from "react-router-dom";

function Header() {
  const menuItems = [
    {
      id: "babylon",
      label: "바빌론",
      path: "/babylonmap",
    },
    {
      id: "serverRoom",
      label: "서버실",
      path: "/server-room-dashboard",
    },
  ];

  return (
    <header className="px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* 네비게이션 메뉴 */}
          <nav className="flex gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-4 transition-all duration-300 text-white ${
                    isActive ? "bg-white/40" : "hover:bg-white/10"
                  }`
                }
              >
                <span className="text-lg font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {/* 알림 */}
          {/* <button className="p-2 text-white hover:bg-white/30 rounded-lg relative">
            <div className="w-5 h-5 flex items-center justify-center">
              <Notifications/>
            </div>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              ?
            </span>
          </button> */}
          
          {/* 사용자 메뉴 */}
          <div className="flex items-center bg-white/20 text-white rounded-xl px-4 py-2 space-x-2">
            {/* <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs">
              테스트
              {user?.name?.[0] || 'U'}
            </div> */}
            테스트
            {/* <span className="font-semibold text-sm">{user?.name || '사용자'}</span> */}
          </div>

          {/* 로그아웃 버튼 */}
          {/* <button 
            onClick={handleLogout}
            className="p-2 text-white hover:bg-white/30 rounded-lg"
            title="로그아웃"
          >
            <Logout />
          </button> */}
        </div>
      </div>
    </header>
  );
}

export default Header;