"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingActionMenuProps = {
  options: {
    label: string;
    onClick: () => void;
    Icon?: React.ReactNode;
  }[];
  className?: string;
};

const FloatingActionMenu = ({
  options,
  className,
}: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        onClick={toggleMenu}
        className="w-10 h-10 rounded-full text-gray-900 shadow-[0_0_20px_rgba(0,0,0,0.1)] backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(239, 233, 225, 0.9)' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFE9E1'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 233, 225, 0.9)'}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: -10, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 10, y: -10, filter: "blur(10px)" }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            className="absolute top-12 right-0 mt-2"
          >
            <div className="flex flex-col items-end gap-2">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                >
                  <Button
                    onClick={option.onClick}
                    size="sm"
                    className="flex items-center gap-2 text-gray-900 shadow-[0_0_20px_rgba(0,0,0,0.1)] border-none rounded-xl backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(239, 233, 225, 0.9)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFE9E1'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 233, 225, 0.9)'}
                  >
                    {option.Icon}
                    <span>{option.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;

