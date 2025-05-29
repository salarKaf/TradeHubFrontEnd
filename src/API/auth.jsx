export async function signupUser(data) {
    const response = await fetch("http://192.168.1.100:3000/api/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "خطای نامشخص");
    }

    return result;
}
