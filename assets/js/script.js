function showCreatePollModal() {
    document.getElementById("createPollModal").style.display = "block";
}

function closeCreatePollModal() {
    document.getElementById("createPollModal").style.display = "none";
}

function createPoll() {
    const question = document.getElementById("pollQuestion").value;
    const options = document.getElementById("pollOptions").value.split(",").map(opt => opt.trim());

    const poll = {
        id: Date.now(),
        question: question,
        options: options,
        results: {}
    };

    let polls = JSON.parse(localStorage.getItem("polls") || "[]");
    polls.push(poll);
    localStorage.setItem("polls", JSON.stringify(polls));

    closeCreatePollModal();
}