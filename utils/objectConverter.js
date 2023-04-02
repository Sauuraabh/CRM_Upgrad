exports.userResponse = (users) => {
    let userResult = [];

    users.forEach(user => {
        userResult.push({
            name: user.name,
            userId: user.userId,
            password: user.password,
            email: user.email,
            userType: user.userType,
            userStatus: user.userStatus
        })
    });

    return userResult;
}