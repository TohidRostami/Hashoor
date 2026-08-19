import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { RoleToggleButton } from "@/components/admin/role-toggle-button";
import { getAllUsers } from "@/lib/queries/admin-users";
import { formatJalali } from "@/lib/date";

export const metadata: Metadata = { title: "کاربران | پنل مدیریت" };

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">کاربران</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-gowun-batang">{users.length}</span> کاربر
        </p>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-center">نام</TableHead>
              <TableHead className="text-center">ایمیل / موبایل</TableHead>
              <TableHead className="text-center">نقش</TableHead>
              <TableHead className="text-center">تاریخ عضویت</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const isPlaceholderEmail = u.email.endsWith("@hashor-phone.local");
              return (
                <TableRow key={u.id}>
                  <TableCell className="text-center font-medium">{u.name}</TableCell>
                  <TableCell className="text-center font-gowun-batang text-muted-foreground" dir="ltr">
                    {isPlaceholderEmail ? u.phoneNumber ?? "—" : u.email}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={u.role === "ADMIN" ? "accent" : "outline"}>
                      {u.role === "ADMIN" ? "ادمین" : "مشتری"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">{formatJalali(u.createdAt)}</TableCell>
                  <TableCell className="pe-6 text-center">
                    <RoleToggleButton userId={u.id} role={u.role} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
