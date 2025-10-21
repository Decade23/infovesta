import ApiClient from "./ApiClient";
import type { User } from "@/domain/models";

class UserService {
    static get i() { return new UserService(); }
    list() { return ApiClient.i.get<User[]>("/api/users"); }
    create(data: Pick<User,"email"|"name"> & { password: string; roles: string[] }) {
        return ApiClient.i.post<User>("/api/users", data);
    }
    update(id: string, data: Partial<Pick<User,"email"|"name"|"roles">>) {
        return ApiClient.i.patch<User>(`/api/users?id=${id}`, data);
    }
    remove(id: string) { return ApiClient.i.del<{ok:true}>(`/api/users?id=${id}`); }
}
export default UserService;
