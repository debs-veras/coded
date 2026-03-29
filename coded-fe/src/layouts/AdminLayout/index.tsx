import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import PageTitle from '../../components/PageTitle';
import Breadcrumbs from '../../components/Breadcrumbs';
import Sidebar from '../../components/Sidebar';

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-dvh flex bg-[#eeeeee] dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 overflow-hidden relative">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-4 py-3 lg:px-6 lg:py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0 shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                <HiMenu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
              <PageTitle />
            </div>
            <div className="hidden md:block">
              <Breadcrumbs />
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 px-4 overflow-y-scroll">
          <div className="pb-10 pt-4 overflow-hidden min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
