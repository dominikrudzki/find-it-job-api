export interface Job {
    id: number,
    name: string,
    remote: boolean,
    salary: { min: number, max: number },
    description: string,
    benefits: Array<string>,
    requirements: Array<string>,
    skills: Array<{ name: string, level: number }>
    employer_id: number,
    experience: 'Junior' | 'Mid' | 'Senior'
}
