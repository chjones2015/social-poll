// This function shows the modal for creating a new poll
function showCreatePollModal() {
    document.getElementById("createPollModal").style.display = "block";
}

// This function closes the modal for creating a new poll
function closeCreatePollModal() {
    document.getElementById("createPollModal").style.display = "none";
}

// This function creates a new poll and saves it to localStorage
function createPoll() {
    // Get the question and options from the form
    const question = document.getElementById("pollQuestion").value;
    const options = document.getElementById("pollOptions").value.split(",").map(opt => opt.trim());

    // Create a new poll object with a unique ID, the question, the options, and an empty results object
    const poll = {
        id: Date.now(),
        question: question,
        options: options,
        results: {}
    };

    // Get the existing polls from localStorage, add the new poll, and save the updated polls back to localStorage
    let polls = JSON.parse(localStorage.getItem("polls") || "[]");
    polls.push(poll);
    localStorage.setItem("polls", JSON.stringify(polls));

    // Close the modal for creating a new poll
    closeCreatePollModal();

    // Show the results for the new poll
    showPollResults(poll.id);
}

// This function shows the results for a poll with the given ID
function showPollResults(pollId) {
    // Retrieve the polls from localStorage
    const polls = JSON.parse(localStorage.getItem("polls") || "[]");

    // Find the poll with the given ID
    const poll = polls.find(p => p.id === pollId);

    // Check if the user has already voted for this poll
    const hasVoted = localStorage.getItem(`poll_${pollId}_voted`) === 'true';

    // Create a table to display the poll results
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    const questionHeader = headerRow.insertCell();
    questionHeader.textContent = 'Question';
    const optionHeader = headerRow.insertCell();
    optionHeader.textContent = 'Option';
    const votesHeader = headerRow.insertCell();
    votesHeader.textContent = 'Votes';

    // Populate the table with the poll results
    poll.options.forEach(option => {
        const row = table.insertRow();
        const questionCell = row.insertCell();
        questionCell.textContent = poll.question;
        const optionCell = row.insertCell();
        optionCell.textContent = option;
        const votesCell = row.insertCell();
        votesCell.textContent = poll.results[option] || 0;
    });

    // Add the table to the pollResults div
    const pollResultsDiv = document.getElementById('pollResults');
    pollResultsDiv.innerHTML = '';
    pollResultsDiv.appendChild(table);

    // Add a form for voting
    const voteForm = document.createElement('form');
    voteForm.addEventListener('submit', event => {
        event.preventDefault();
        const selectedOption = voteForm.querySelector('input[name="option"]:checked');
        if (selectedOption) {
            const option = selectedOption.value;
            if (!hasVoted) {
                poll.results[option] = (poll.results[option] || 0) + 1;
                localStorage.setItem(`poll_${pollId}_voted`, 'true');
                localStorage.setItem("polls", JSON.stringify(polls));
            }
            showPollResults(pollId);
        }
    });

    // Add radio buttons for each option
    poll.options.forEach(option => {
        const optionLabel = document.createElement('label');
        optionLabel.textContent = option;
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = 'option';
        optionInput.value = option;
        optionInput.disabled = hasVoted;
        optionLabel.appendChild(optionInput);
        voteForm.appendChild(optionLabel);
    });

    // Add a submit button to the form
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    if (hasVoted) {
        submitButton.textContent = 'Already Voted';
        submitButton.disabled = true;
    } else {
        submitButton.textContent = 'Vote';
        submitButton.disabled = false;
    }
    submitButton.disabled = hasVoted;
    voteForm.appendChild(submitButton);

    // Add the form to the pollResults div
    pollResultsDiv.appendChild(voteForm);
}