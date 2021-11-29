/**
 * This is the User Modelthe required Fields are:
 * userId
 * username
 * firstname
 * lastname
 * email
 */
export class User {

  constructor(
    public userId: number,
    public username: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public address: string,
    public birthday: string,
    public phoneNumber: number,

  ) {}
}
