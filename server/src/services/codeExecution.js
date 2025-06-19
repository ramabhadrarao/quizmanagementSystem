import Docker from 'dockerode';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const docker = new Docker();

// Language configurations
const LANGUAGE_CONFIGS = {
  python: {
    image: 'python:3.9-alpine',
    extension: 'py',
    command: ['python', '/code/main.py'],
    timeout: 10000,
  },
  javascript: {
    image: 'node:16-alpine',
    extension: 'js',
    command: ['node', '/code/main.js'],
    timeout: 10000,
  },
  cpp: {
    image: 'gcc:latest',
    extension: 'cpp',
    command: ['sh', '-c', 'cd /code && g++ -o main main.cpp && ./main'],
    timeout: 15000,
  },
  c: {
    image: 'gcc:latest',
    extension: 'c',
    command: ['sh', '-c', 'cd /code && gcc -o main main.c && ./main'],
    timeout: 15000,
  },
  java: {
    image: 'openjdk:11-alpine',
    extension: 'java',
    command: ['sh', '-c', 'cd /code && javac Main.java && java Main'],
    timeout: 15000,
  },
};

export async function executeCode(code, language, testCases = [], input = '') {
  const config = LANGUAGE_CONFIGS[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const executionId = uuidv4();
  const results = {
    output: '',
    error: '',
    testResults: [],
  };

  try {
    // Create temporary directory for code execution
    const tempDir = `/tmp/code-execution-${executionId}`;
    await fs.mkdir(tempDir, { recursive: true });

    // Write code to file
    const fileName = language === 'java' ? 'Main.java' : `main.${config.extension}`;
    const filePath = path.join(tempDir, fileName);
    await fs.writeFile(filePath, code);

    // If no test cases, run with provided input
    if (testCases.length === 0) {
      const result = await runCodeInContainer(config, tempDir, input);
      results.output = result.output;
      results.error = result.error;
    } else {
      // Run code against each test case
      for (const testCase of testCases) {
        const result = await runCodeInContainer(config, tempDir, testCase.input);
        
        const testResult = {
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput.trim(),
          actualOutput: result.output.trim(),
          error: result.error,
        };

        // Check if output matches expected (allowing for whitespace differences)
        if (!result.error && testResult.actualOutput === testResult.expectedOutput) {
          testResult.passed = true;
        }

        results.testResults.push(testResult);
      }
    }

    // Clean up temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });

    return results;
  } catch (error) {
    console.error('Code execution error:', error);
    throw new Error(`Code execution failed: ${error.message}`);
  }
}

async function runCodeInContainer(config, codeDir, input) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Code execution timeout'));
    }, config.timeout);

    docker.run(
      config.image,
      config.command,
      process.stdout,
      {
        HostConfig: {
          Binds: [`${codeDir}:/code:ro`],
          Memory: 128 * 1024 * 1024, // 128MB memory limit
          CpuQuota: 50000, // 50% CPU limit
          NetworkMode: 'none', // No network access
          ReadonlyRootfs: false,
          AutoRemove: true,
        },
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        OpenStdin: true,
        StdinOnce: true,
        Tty: false,
      },
      (err, data, container) => {
        clearTimeout(timeout);
        
        if (err) {
          reject(err);
          return;
        }

        let output = '';
        let error = '';

        container.attach({
          stream: true,
          stdin: true,
          stdout: true,
          stderr: true,
        }, (err, stream) => {
          if (err) {
            reject(err);
            return;
          }

          // Send input to container
          if (input) {
            stream.write(input + '\n');
          }
          stream.end();

          // Collect output
          const chunks = [];
          stream.on('data', (chunk) => {
            chunks.push(chunk);
          });

          stream.on('end', () => {
            const buffer = Buffer.concat(chunks);
            
            // Docker multiplexes stdout and stderr
            // Parse the multiplexed stream
            let offset = 0;
            while (offset < buffer.length) {
              if (offset + 8 > buffer.length) break;
              
              const header = buffer.slice(offset, offset + 8);
              const streamType = header[0];
              const size = header.readUInt32BE(4);
              
              if (offset + 8 + size > buffer.length) break;
              
              const data = buffer.slice(offset + 8, offset + 8 + size).toString();
              
              if (streamType === 1) { // stdout
                output += data;
              } else if (streamType === 2) { // stderr
                error += data;
              }
              
              offset += 8 + size;
            }

            resolve({
              output: output.trim(),
              error: error.trim(),
            });
          });

          stream.on('error', (err) => {
            reject(err);
          });
        });
      }
    );
  });
}