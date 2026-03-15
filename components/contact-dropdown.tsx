"use client";

import { Mail, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonGroup } from "@/components/ui/button-group";

interface ContactDropdownProps {
  email: string;
  phone: string;
  variant?: "default" | "outline";
  className?: string;
}

export const ContactDropdown = ({ email, phone, variant = "default", className }: ContactDropdownProps) => {
  const whatsappNumber = phone.replace(/\s+/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <ButtonGroup className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
          >
            <Mail className="w-4 h-4" />
            Contactez-moi
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
};
