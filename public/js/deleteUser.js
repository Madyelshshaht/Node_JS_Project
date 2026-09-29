function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    fetch(`/user/delete/${id}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(data => {

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: data.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "/";
                });
            } else {
                alert(data.message);
            }

        })
        .catch(err => {
            console.error(err);
            alert("Something went wrong");
        });
}