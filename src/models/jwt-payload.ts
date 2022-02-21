export interface jwtPayload {
    email: string
    employer?: boolean
    companyName?: string
    companyImage?: string
    iat: number
    exp: number
}
