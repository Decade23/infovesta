import LoginForm from "@/components/forms/LoginForm";
export default function Page(){
    return (
        <div className="min-h-dvh grid place-items-center">
            <div className="w-full max-w-sm bg-white rounded-xl shadow p-6">
                <h1 className="text-xl font-bold mb-4">Login</h1>
                <LoginForm />
            </div>
        </div>
    );
}
