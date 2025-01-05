import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, Mail, GraduationCap, Stethoscope } from "lucide-react";
import type { EditorialMember } from "./types";

interface EditorialMemberCardProps {
  member: EditorialMember;
}

export const EditorialMemberCard = ({ member }: EditorialMemberCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/20">
            <AvatarImage src={member.image} alt={member.name} className="object-cover" />
            <AvatarFallback className="bg-primary text-white">
              <UserRound className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
          <p className="text-primary font-medium mb-2">{member.role}</p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <GraduationCap className="h-4 w-4" />
            <span>{member.title}</span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Stethoscope className="h-4 w-4 text-primary mt-1" />
            <p className="text-gray-600">{member.specialty}</p>
          </div>
          {member.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-primary mt-1" />
              <a href={`mailto:${member.email}`} className="text-primary hover:text-primary-light">
                {member.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};