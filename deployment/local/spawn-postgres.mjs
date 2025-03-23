import {exec} from "node:child_process"

const executeCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
};

const containerName = 'spawn';
const dockerRunCommand = `
  docker run --name ${containerName} \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=spawn \
    -e POSTGRES_USER=spawn \
    -e POSTGRES_DB=spawn \
    -d postgres
`;
const dockerStartCommand = `docker start ${containerName}`;

const manageDockerContainer = async () => {
    try {
        const { stdout } = await executeCommand(dockerRunCommand);

        console.log(`Docker container started successfully:\n${stdout}`);
    } catch ({ error, stderr }) {
        if (stderr.includes('Conflict. The container name')) {
            console.log(`Container "${containerName}" already exists. Attempting to start it...`);

            try {
                const { stdout: startStdout } = await executeCommand(dockerStartCommand);

                console.log(`Docker container started successfully:\n${startStdout}`);
            } catch (startError) {
                console.error(`Failed to start existing container: ${startError.stderr || startError.error.message}`);

                process.exit(1);
            }
        } else {
            console.error(`Error spawning Docker container: ${stderr || error.message}`);

            process.exit(1);
        }
    }
};

manageDockerContainer();
