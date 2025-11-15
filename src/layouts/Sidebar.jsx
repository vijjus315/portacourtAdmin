import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Image, Nav } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import user1 from "../assets/img/avatar6.jpg";
import { logout as logoutService, getCurrentUser } from "../services/api/auth";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 992) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    document.body.classList.toggle("no-scroll", sidebarOpen);
  }, [sidebarOpen]);

  const handleNavLinkClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
      setOpenSubmenu(null);
    }
  };

  const handleSubmenuClick = (id, e) => {
    e.preventDefault();
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  const isSubmenuItemActive = useCallback(
    (submenu) => submenu.some((sub) => location.pathname.startsWith(sub.link)),
    [location.pathname]
  );

  const pages = useMemo(
    () => [
      {
        id: "Dashboard",
        title: "Dashboard",
        link: "/dashboard",
        icon: "tabler:layout-dashboard",
      },
      {
        id: "UsersManagement",
        title: "Users Management",
        link: "javascript:void(0)",
        icon: "lucide:users",
        submenu: [
          { id: "Users", title: "Users", link: "/users" },
          // { id: 'Hosts', title: 'Chefs', link: '/host' },
        ],
      },
      {
        id: "Banners",
        title: "Banners",
        link: "/banners",
        icon: "material-symbols:wallpaper-outline",
      },
    {
      id: "Categories",
      title: "Categories",
      link: "/categories",
      icon: "mdi:shape-outline",
    },
    {
      id: "Contacts",
      title: "Contacts",
      link: "/contacts",
      icon: "mdi:account-voice",
    },
    {
      id: "Coupons",
      title: "Coupons",
      link: "/coupons",
      icon: "mdi:ticket-percent-outline",
    },
    {
      id: "Blogs",
      title: "Blogs",
      link: "/blogs",
      icon: "mdi:blog-outline",
    },
    {
      id: "Courts",
      title: "Courts",
      link: "/courts",
      icon: "mdi:tennis",
    },
    {
      id: "Events",
      title: "Events",
      link: "/events",
      icon: "mdi:calendar-star",
    },
      // {
      //   id: "Properties",
      //   title: "Properties",
      //   link: "/property",
      //   icon: "icons8:home",
      // },
      {
        id: "Bookings",
        title: "Bookings",
        link: "/bookings",
        icon: "iconoir:calendar-check",
      },
      {
        id: "Invoices",
        title: "Invoices",
        link: "/invoices",
        icon: "hugeicons:save-money-dollar",
      },
      {
        id: "Reports",
        title: "Reports",
        link: "/reports",
        icon: "iconoir:stats-report",
      },
      {
        id: "Notifications",
        title: "Notifications",
        link: "/notifications",
        icon: "iconoir:bell",
      },
      {
        id: "Settings",
        title: "Settings",
        link: "/profilesetting",
        icon: "tabler:settings",
      },
    ],
    []
  );
  useEffect(() => {
    const currentPage = pages.find(page =>
      page.submenu && isSubmenuItemActive(page.submenu)
    );
    if (currentPage) {
      setOpenSubmenu(currentPage.id);
    } else {
      setOpenSubmenu(null);
    }
  }, [isSubmenuItemActive, location.pathname, pages]);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };

    const handleUserEvent = (event) => {
      setUser(event.detail || getCurrentUser());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth:user-update", handleUserEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth:user-update", handleUserEvent);
    };
  }, []);

  const profileImageSrc = useMemo(() => {
    if (!user?.profile_image) {
      return user1;
    }

    if (/^https?:\/\//i.test(user.profile_image)) {
      return user.profile_image;
    }

    const baseEnv =
      import.meta.env.VITE_MEDIA_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL?.replace(/\/admin\/api\/?$/, "/");

    if (baseEnv) {
      const normalizedBase = baseEnv.endsWith("/") ? baseEnv : `${baseEnv}/`;
      const normalizedPath = user.profile_image.startsWith("/")
        ? user.profile_image.slice(1)
        : user.profile_image;
      return `${normalizedBase}${normalizedPath}`;
    }

    return user.profile_image.startsWith("/")
      ? user.profile_image
      : `/${user.profile_image}`;
  }, [user]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutService();
    } catch (error) {
      console.warn("Logout request failed", error);
    } finally {
      setUser(null);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <button
        className={sidebarOpen ? "btnclose sidebarbg-open" : "btnclose sidebarbg-closed"}
        style={{ display: 'none' }}
        onClick={toggleSidebar}
      ></button>

      <div className={sidebarOpen ? "sidebar sidebar-open" : "sidebar sidebar-closed"}>
        <button className="toggledesktop_btn" onClick={toggleSidebar}>
          <Icon icon={sidebarOpen ? "lucide:chevron-left" : "lucide:chevron-right"} />
        </button>

        <div className="sidebarprofile_div">
          <Image src={profileImageSrc} alt="" />
          <div className="sidebarprofile_info">
            <h4>{user?.first_name || "Admin User"}</h4>
            <p>{user?.email || "admin@example.com"}</p>
          </div>
        </div>

        <div className="sidebarouter">
          {pages.map(page => {
            const isMenuActive =
              openSubmenu === page.id ||
              (page.submenu && isSubmenuItemActive(page.submenu)) ||
              (page.link !== 'javascript:void(0)' && location.pathname.startsWith(page.link));

            return (
              <div key={page.id} className="navitem-container" id={page.id}>
                {page.link !== '#' && page.link !== 'javascript:void(0)' ? (
                  <Nav.Link
                    as={NavLink}
                    to={page.link}
                    className={`navitem ${isMenuActive ? 'active' : ''}`}
                    onClick={page.submenu ? (e) => handleSubmenuClick(page.id, e) : handleNavLinkClick}
                  >
                    <div className="flex-grow-1 side-menu__icon">
                      <Icon icon={page.icon} />
                      {page.title}
                    </div>
                    {page.submenu && (
                      <Icon
                        icon={openSubmenu === page.id ? "mdi:chevron-down" : "mdi:chevron-right"}
                        className={`submenu-icon me-0 ${openSubmenu === page.id ? 'open' : ''}`}
                      />
                    )}
                  </Nav.Link>
                ) : (
                  <Nav.Link
                    className={`navitem ${isMenuActive ? 'active' : ''}`}
                    onClick={page.submenu ? (e) => handleSubmenuClick(page.id, e) : handleNavLinkClick}
                  >
                    <div className="flex-grow-1 side-menu__icon">
                      <Icon icon={page.icon} />
                      {page.title}
                    </div>
                    {page.submenu && (
                      <Icon
                        icon={openSubmenu === page.id ? "mdi:chevron-down" : "mdi:chevron-right"}
                        className={`submenu-icon me-0 ${openSubmenu === page.id ? 'open' : ''}`}
                      />
                    )}
                  </Nav.Link>
                )}

                {page.submenu && openSubmenu === page.id && (
                  <div className="submenu">
                    {page.submenu.map(sub => (
                      sub.link !== '#' && sub.link !== 'javascript:void(0)' ? (
                        <Nav.Link
                          key={sub.id}
                          as={NavLink}
                          to={sub.link}
                          className={`submenu-item ${location.pathname.startsWith(sub.link) ? 'active' : ''}`}
                          onClick={handleNavLinkClick}
                        >
                          {sub.title}
                        </Nav.Link>
                      ) : (
                        <Nav.Link key={sub.id} className="submenu-item disabled">
                          {sub.title}
                        </Nav.Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="sidebarfooter_nav">
          <button type="button" className="btn_logout" onClick={handleLogout}>
            <span>
              <Icon icon="majesticons:logout" width="24" height="24" /> Logout
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
