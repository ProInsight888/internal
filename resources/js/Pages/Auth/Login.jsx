import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="grid grid-cols-12">
            <div
                id="login-bg-left"
                className="col-span-7 h-screen bg-cover bg-red-500"
            >
                {/* <img src="" alt="" /> */}
            </div>
            <div className="min-h-screen flex col-span-5 w-full items-center justify-center bg-white py-6 px-2 sm:px-3 lg:px-4">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Sign in to access your account
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg">
                            {status}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={submit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="mb-6">
                                <InputLabel
                                    htmlFor="email"
                                    value="Email"
                                    className="text-purple-700 font-medium"
                                />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-lg border-2 border-purple-100 bg-purple-50 px-4 py-3 transition duration-300 focus:border-purple-500 focus:ring-purple-500"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                    className="text-purple-700 font-medium"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-lg border-2 border-purple-100 bg-purple-50 px-4 py-3 transition duration-300 focus:border-purple-500 focus:ring-purple-500"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>
                        </div>
                        <div>
                            <PrimaryButton
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md shadow-purple-500/30 transition-all duration-300"
                                disabled={processing}
                            >
                                {processing ? "Signing in..." : "Sign in"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}