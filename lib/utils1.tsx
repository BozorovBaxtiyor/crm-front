import { Phone, Mail, Users, Target } from 'lucide-react';

export function getActivityIcon(type: string) {
  switch (type) {
    case 'call':
      return <Phone className="h-4 w-4 text-blue-600" />;
    case 'email':
      return <Mail className="h-4 w-4 text-purple-600" />;
    case 'meeting':
      return <Users className="h-4 w-4 text-green-600" />;
    case 'deal':
      return <Target className="h-4 w-4 text-yellow-600" />;
    default:
      return <Phone className="h-4 w-4 text-gray-600" />;
  }
}
