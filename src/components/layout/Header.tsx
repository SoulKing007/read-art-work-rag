import { Menu, Settings, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuClick: () => void;
  pageTitle: string;
}

const Header = ({ onMenuClick, pageTitle }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 h-16 bg-primary">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left: Menu button and logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-normal text-primary-foreground/80">RAG</span>
              <span className="text-lg font-bold text-primary-foreground">Dashboard</span>
            </div>
          </div>
        </div>

        {/* Center: Page title */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-primary-foreground hidden md:block">
          {pageTitle}
        </h1>

        {/* Right: User menu */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 px-2 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-sm font-medium">
                    JD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:block">John Doe</span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
