
export interface User {
  id: string;
  email: string;
}

export interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  profilePicture?: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Skill {
  name: string;
}

export interface Resume {
  id: string;
  name: string;
  template: 'modern' | 'classic' | 'minimal' | 'professional' | 'creative';
  personalDetails: PersonalDetails;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
}
