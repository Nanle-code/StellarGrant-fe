import { Column, Entity, OneToMany, PrimaryColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { MilestoneProof } from "./MilestoneProof";
import { GrantReviewer } from "./GrantReviewer";

@Entity({ name: "grants" })
export class Grant {
  @PrimaryColumn({ type: "int" })
  id!: number;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 30 })
  status!: string;

  @Column({ type: "varchar", length: 120 })
  owner!: string;

  @Column({ type: "varchar", length: 120 })
  recipient!: string;

  @Column({ type: "varchar", length: 60 })
  totalAmount!: string;

  @Column({ type: "text", nullable: true })
  tags?: string;

  @ManyToMany(() => GrantReviewer)
  @JoinTable({
    name: "grant_reviewers_junction",
    joinColumn: { name: "grantId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "reviewerId", referencedColumnName: "id" },
  })
  reviewers?: GrantReviewer[];

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => MilestoneProof, (proof) => proof.grant)
  proofs!: MilestoneProof[];
}
