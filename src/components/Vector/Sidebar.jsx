"use client";

import { cn } from "../../lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LayoutDashboard, BotMessageSquare, User, Settings, LogOut, Trash2, Heart, Target } from 'lucide-react'
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}) => {
    const [openState, setOpenState] = useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const Sidebar = ({
    children,
    open,
    setOpen,
    animate,
}) => {
    return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>
    );
};

export const SidebarBody = (props) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...(props)} />
        </>
    );
};

export const DesktopSidebar = ({
    className,
    children,
    ...props
}) => {
    const { open, setOpen, animate } = useSidebar();
    return (
        <motion.div
            className={cn(
                "h-full px-4 py-4 hidden md:flex md:flex-col bg-[#FFFFFF] border-r border-[#E4E5E1] shrink-0",
                className
            )}
            animate={{
                width: animate ? (open ? "300px" : "60px") : "300px",
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const MobileSidebar = ({
    className,
    children,
    ...props
}) => {
    const { open, setOpen } = useSidebar();
    return (
        <div
            className={cn(
                "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-[#FFFFFF] border-b border-[#E4E5E1] w-full"
            )}
            {...props}
        >
            <div className="flex justify-end z-20 w-full">
                <Menu
                    className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                        className={cn(
                            "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                            className
                        )}
                    >
                        <div
                            className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                            onClick={() => setOpen(!open)}
                        >
                            <X />
                        </div>
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const SidebarLink = ({
    link,
    className,
    ...props
}) => {
    const { open, animate } = useSidebar();
    return (
        <a
            href={link.href}
            onClick={link.onClick}
            className={cn(
                "flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer",
                className
            )}
            {...props}
        >
            {link.icon}
            <motion.span
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
            >
                {link.label}
            </motion.span>
        </a>
    );
};

export default function FullSidebar({ children, onClearChat }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    
    const isVectorPage = location.pathname === '/vector';

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const links = [
        {
            label: "Zenith",
            href: "/zenith",
            icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
            onClick: (e) => {
                e.preventDefault();
                navigate('/zenith');
            }
        },
        {
            label: "Vector",
            href: "/vector",
            icon: <BotMessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
            onClick: (e) => {
                e.preventDefault();
                navigate('/vector');
            }
        },
        {
            label: "Profile",
            href: "/profile",
            icon: <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
            onClick: (e) => {
                e.preventDefault();
                navigate('/profile');
            }
        },
        {
            label: "My Skills",
            href: "/skills",
            icon: <Target className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
            onClick: (e) => {
                e.preventDefault();
                navigate('/skills');
            }
        },
        ...(isVectorPage ? [{
            label: "Clear Chat",
            href: "#",
            icon: <Trash2 className="text-red-600 dark:text-red-400 h-5 w-5 shrink-0" />,
            onClick: (e) => {
                e.preventDefault();
                if (onClearChat) {
                    onClearChat();
                }
            }
        }] : []),
        {
            label: "Logout",
            href: "#",
            icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
            onClick: handleLogout
        },
    ];

    return (
        <div className={`flex h-screen ${children ? 'w-full' : 'shrink-0'} overflow-hidden`}>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                href: "#",
                                icon: (
                                    <div className="flex items-center gap-2 w-full">
                                        <img 
                                            className="h-7 w-7 shrink-0 rounded-full object-cover" 
                                            src="https://miro.medium.com/v2/resize:fit:1100/format:webp/0*A7MUqyCLvZDcHkfM.jpg" 
                                            alt="Skillora AI" 
                                        />
                                        <motion.span
                                            animate={{
                                                display: open ? "inline-block" : "none",
                                                opacity: open ? 1 : 0,
                                            }}
                                            className="text-neutral-700 dark:text-neutral-200 text-lg font-bold whitespace-pre"
                                        >
                                            Skillora
                                        </motion.span>
                                    </div>
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            {children && (
                <div className="flex-1 h-screen overflow-y-auto">
                    {children}
                </div>
            )}
        </div>
    );
}