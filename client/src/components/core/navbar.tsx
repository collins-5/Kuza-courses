import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/core/mode-toggle';
import { useAuth } from '@/hooks/useAuth';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8">
      <rect width="32" height="32" rx="10" className="fill-primary" />
      <path
        d="M10 8v16M10 17l10-9M13.5 15l8.5 9"
        className="stroke-sun"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, isBootstrapping, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight"
          >
            <LogoMark />
            <span>Kuza</span>
          </Link>

          <NavLink
            to="/courses"
            end
            className={({ isActive }) =>
              `hidden text-sm font-medium transition-colors hover:text-primary sm:block ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            Courses
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {isBootstrapping ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : isAuthenticated && user ? (
            <>
              <Button
                asChild
                size="sm"
                className="hidden rounded-full sm:inline-flex"
              >
                <Link to="/courses/create">
                  <Plus className="mr-1.5 h-4 w-4" />
                  New Course
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Open user menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-sun text-xs font-bold text-ed">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/courses/create" className="cursor-pointer">
                      <Plus className="mr-2 h-4 w-4" />
                      New Course
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/courses" className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse Courses
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}