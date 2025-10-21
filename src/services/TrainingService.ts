// src/services/TrainingService.ts
import ApiClient from "./ApiClient";
import type { Training } from "@/domain/models";
import type { CreateTrainingRequest, UpdateTrainingRequest } from "@/dto/requests/training";

class TrainingService {
    static get i() { return new TrainingService(); }

    list() {
        return ApiClient.i.get<Training[]>("/api/trainings");
    }
    get(id: string) {
        return ApiClient.i.get<Training>(`/api/trainings/${id}`);
    }
    create(payload: CreateTrainingRequest) {
        return ApiClient.i.post<Training>("/api/trainings", payload);
    }
    update(id: string, payload: UpdateTrainingRequest) {
        return ApiClient.i.patch<Training>(`/api/trainings/${id}`, payload);
    }
    remove(id: string) {
        return ApiClient.i.del<{ ok: true }>(`/api/trainings/${id}`);
    }
}

export default TrainingService;
