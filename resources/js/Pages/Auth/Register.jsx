import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Fragment, useState } from "react";

export default function Register({ users }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        role: "user",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showDeleteEdit, setShowDeleteEdit] = useState(false);

    // console.log(users.password);

    const submit = (e) => {
        e.preventDefault();

        post(route("add_account.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Add New Account
                </h2>
            }
        >
            <div className="flex flex-col items-center w-7xl bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
                <div>
                    <Link href="/">
                        <img
                            className="w-96"
                            src="\logo\Logo Pro Insight.png"
                            alt=""
                        />
                    </Link>
                </div>
                <div className="max-w-7xl w-full flex mt-6 gap-5 justify-between">
                    <div className="max-w-4xl w-full bg-white px-6 py-4 shadow-md sm:rounded-lg dark:bg-gray-800">
                        <table className="w-full border-collapse text-white">
                            <thead>
                                <tr className="bg-gray-900">
                                    <th>No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <Fragment key={user.password}>
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td className="">
                                                <button>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        onClick={() =>
                                                            setShowDeleteEdit(
                                                                index,
                                                            )
                                                        }
                                                        className={``}
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                                    </svg>
                                                </button>
                                                <div
                                                    className={`${showDeleteEdit === index ? "" : "hidden"} bg-gray-950 ml-3 rounded-md absolute w-40 h-20 p-2 flex items-left flex-col justify-center`}
                                                >
                                                    <button
                                                        id="delete"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "Are you sure?",
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    route(
                                                                        "user.destroy",
                                                                        {
                                                                            user: user.password,
                                                                        },
                                                                    ),
                                                                    {
                                                                        onSuccess:
                                                                            () =>
                                                                                alert(
                                                                                    "Task deleted!",
                                                                                ),
                                                                        onError:
                                                                            (
                                                                                errors,
                                                                            ) =>
                                                                                console.error(
                                                                                    errors,
                                                                                ),
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                        className="text-left ml-2 text-sm p-2 w-fit hover:text-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                    <div
                                                        id="line-delete-edit"
                                                        className="w-full h-[1px] bg-white border-b-[1px]"
                                                    ></div>
                                                    <Link
                                                        id="edit"
                                                        className="text-left ml-2 text-sm p-2 w-fit hover:text-green-600"
                                                    >
                                                        Edit
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-full overflow-hidden  bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">
                        <Head title="Register" />

                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="name" value="Name" />

                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="role" value="Role" />

                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    className="mt-1 block w-full"
                                    autoComplete="role"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                    required
                                >
                                    <option value="user" selected>
                                        User
                                    </option>
                                    <option value="intern">Intern</option>
                                    <option value="admin">Admin</option>
                                </select>

                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                />

                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4 flex items-center justify-end">
                                <PrimaryButton
                                    className="ms-4"
                                    onSubmit={(e) => submit(e)}
                                    disabled={processing}
                                >
                                    New Account
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
