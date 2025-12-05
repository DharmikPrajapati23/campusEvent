
//========================================================================
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Admin_Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a className="text-xl font-bold text-blue-600">
            campusEvent
          </a>
        </div>
</div>
    </nav>
  );
};

export default Admin_Navbar;
