export type AuditableData = {
  createdBy: string;
  createdAt?: Date;
  lastModifiedAt?: Date;
};

export abstract class AuditableEntity {

  private lastModifiedAt: Date;
  private readonly createdAt: Date;

  protected constructor(data: AuditableData) {
    const creationDate = data.createdAt ? new Date(data.createdAt) : new Date();
    this.createdAt = creationDate;
    this.lastModifiedAt = creationDate;
  }

  public get getCreatedAt(): Date {
    return this.createdAt;
  }

  public get getLastModifiedAt(): Date {
    return this.lastModifiedAt;
  }

  public set setLastModifiedAt(newDate: Date) {
    this.lastModifiedAt = newDate;
  }
}
