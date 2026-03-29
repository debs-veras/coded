import { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HiHome,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown,
  HiLogout,
  HiSun,
  HiMoon,
  HiX,
  HiUsers,
  HiBookOpen,
  HiPencilAlt,
} from 'react-icons/hi';
import { useUserStore } from '../../hooks/useUserStore';
import { useTheme } from '../../contexts/ThemeContext';
import type { MenuItem } from '../../types/menuItem';
import { logout } from '../../services/auth.service';
import ScrollArea from '../ui/ScrollArea';
import Tooltip from '../ui/Tooltip';
import useToastLoading from '../../hooks/useToastLoading';
import { translateRole, getRoleBadgeStyles } from '../../utils/roles';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToastLoading();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('menuOpen');
    return saved === null ? true : saved === 'true';
  });
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const { user, clearAuth } = useUserStore();
  const userRole = user?.role || '';
  const isExpanded = menuOpen || !!isOpen;

  const menuItems: MenuItem[] = [
    {
      icon: <HiHome className="w-6 h-6" />,
      label: 'Dashboard',
      path: '/dashboard',
      roles: ['STUDENT'],
    },
    {
      icon: <HiUsers className="w-6 h-6" />,
      label: 'Usuários',
      path: '/users',
      roles: ['ADMIN'],
      subItems: [
        {
          label: 'Novo Usuário',
          path: '/user/form',
          roles: ['ADMIN'],
        },
        {
          label: 'Gerenciar Usuários',
          path: '/users',
          roles: ['ADMIN'],
        },
      ],
    },
    {
      icon: <HiBookOpen className="w-6 h-6" />,
      label: 'Turmas',
      path: '/turmas',
      roles: ['ADMIN'],
      subItems: [
        {
          label: 'Nova Turma',
          path: '/turma/form',
          roles: ['ADMIN'],
        },
        {
          label: 'Gerenciar Turmas',
          path: '/turmas',
          roles: ['ADMIN'],
        },
      ],
    },
    {
      icon: <HiPencilAlt className="w-6 h-6" />,
      label: 'Atividades',
      path: '/atividades',
      roles: ['TEACHER', 'STUDENT'],
      subItems: [
        {
          label: 'Minhas Atividades',
          path: '/atividades',
          roles: ['TEACHER'],
        },
        {
          label: 'Nova Atividade',
          path: '/atividades/form',
          roles: ['TEACHER'],
        },
        {
          label: 'Atividades da Turma',
          path: '/atividades/turma',
          roles: ['STUDENT'],
        },
        {
          label: 'Minhas Respostas',
          path: '/respostas/historico',
          roles: ['STUDENT'],
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems
    .filter((item) => !item.roles || item.roles.includes(userRole))
    .map((item) => ({
      ...item,
      subItems: item.subItems?.filter(
        (subItem) => !subItem.roles || subItem.roles.includes(userRole)
      ),
    }));

  const handleLogout = async () => {
    toast({ mensagem: 'Saindo do sistema...' });
    const response = await logout(user?.refresh || '');
    toast({ tipo: 'dismiss' });
    if (response.success) {
      clearAuth();
      navigate('/login');
    }
    toast({
      mensagem: response.message,
      tipo: response.type,
    });
  };

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isSubmenuActive = useCallback(
    (subItems: Array<{ path: string }>) => {
      return subItems.some((item) => location.pathname === item.path);
    },
    [location.pathname]
  );

  useEffect(() => {
    localStorage.setItem('menuOpen', String(menuOpen));
  }, [menuOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`h-dvh flex flex-col transition-all duration-300 shadow-lg border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden 
          ${isExpanded ? 'w-64' : 'w-20'} 
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative z-50 lg:z-0
        `}
      >
        {/* Header */}
        <div
          className={`flex items-center transition-all duration-300 mt-5 px-4 py-2 shrink-0 ${
            isExpanded ? 'justify-between' : 'justify-center flex-col gap-3'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold select-none shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              CED
            </div>
            {isExpanded && (
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">
                Ceará
              </span>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0 cursor-pointer"
          >
            <HiX className="w-5 h-5 text-(--color-secondary)" />
          </button>

          {/* Desktop minimize button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0 cursor-pointer"
          >
            {menuOpen ? (
              <HiChevronLeft className="w-5 h-5 text-(--color-secondary)" />
            ) : (
              <HiChevronRight className="w-5 h-5 text-(--color-secondary)" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 min-h-0" paddingX="">
          <nav className="px-3 py-4 space-y-1">
            {filteredMenuItems.map((item, index) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isActive =
                location.pathname === item.path ||
                (hasSubItems && isSubmenuActive(item.subItems!));
              const isSubmenuOpen = openSubmenus[item.label];

              return (
                <div key={index}>
                  {hasSubItems ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className={`group relative flex items-center transition-all duration-200 rounded-lg w-full px-3 py-2.5 gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                          isActive
                            ? 'bg-(--color-secondary)/10 border-l-4 border-(--color-secondary)'
                            : ''
                        }`}
                      >
                        <Tooltip content={item.label} disabled={isExpanded}>
                          <div
                            className={`shrink-0 transition-colors ${
                              isActive
                                ? 'text-(--color-secondary)'
                                : 'text-gray-400 group-hover:text-(--color-secondary)'
                            }`}
                          >
                            {item.icon}
                          </div>
                        </Tooltip>

                        {isExpanded && (
                          <>
                            <span className="font-medium text-sm text-gray-700 dark:text-gray-200 flex-1 text-left">
                              {item.label}
                            </span>
                            <HiChevronDown
                              className={`w-5 h-5 transition-transform duration-200 text-gray-400 ${
                                isSubmenuOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </>
                        )}
                      </button>

                      {isExpanded && isSubmenuOpen && (
                        <div className="ml-9 mt-1 space-y-1">
                          {item.subItems!.map((subItem, subIndex) => (
                            <NavLink
                              key={subIndex}
                              to={subItem.path}
                              end
                              className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg text-sm transition-colors ${
                                  isActive
                                    ? 'text-(--color-secondary) bg-(--color-secondary)/10'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`
                              }
                            >
                              {subItem.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `group flex items-center px-3 py-2.5 gap-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                          isActive
                            ? 'bg-(--color-secondary)/10 border-l-4 border-(--color-secondary)'
                            : ''
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Tooltip content={item.label} disabled={isExpanded}>
                            <div
                              className={`shrink-0 transition-colors ${
                                isActive
                                  ? 'text-(--color-secondary)'
                                  : 'text-gray-600 dark:text-gray-400 group-hover:text-(--color-secondary)'
                              }`}
                            >
                              {item.icon}
                            </div>
                          </Tooltip>
                          {isExpanded && (
                            <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
                              {item.label}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-3 space-y-2 shrink-0">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full ${
              !isExpanded ? 'justify-center' : ''
            }`}
          >
            <Tooltip content="Alternar tema" disabled={isExpanded}>
              {theme === 'light' ? (
                <HiMoon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <HiSun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </Tooltip>
            {isExpanded && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tema
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-gray-600 dark:text-gray-400 ${
              !isExpanded ? 'justify-center' : ''
            }`}
          >
            <Tooltip content="Sair" disabled={isExpanded}>
              <HiLogout className="w-5 h-5" />
            </Tooltip>
            {isExpanded && <span className="text-sm">Sair</span>}
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div
            className={`flex items-center gap-3 px-3 py-3 bg-gray-100 dark:bg-gray-800 shrink-0 ${
              !isExpanded ? 'justify-center' : ''
            }`}
          >
            {/* Avatar fake com inicial */}
            <div className="w-9 h-9 rounded-full bg-(--color-secondary) flex items-center justify-center text-white font-semibold shrink-0 shadow-sm border border-white/10">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>

            {isExpanded && (
              <div className="flex flex-col text-sm truncate">
                <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user.email}
                </span>
                <div className="flex mt-1">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                      getRoleBadgeStyles(userRole).bg
                    } ${getRoleBadgeStyles(userRole).text} ${
                      getRoleBadgeStyles(userRole).border
                    }`}
                  >
                    {translateRole(userRole)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
