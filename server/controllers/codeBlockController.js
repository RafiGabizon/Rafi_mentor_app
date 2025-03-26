const CodeBlock = require('../models/CodeBlock');
// Get all code blocks
exports.getCodeBlocks = async (req, res) => {
    try {
        const codeBlocks = await CodeBlock.find().select('title description');
        res.json(codeBlocks);

    }catch (error) {
        res.status(500).json({message: error.message});
    }
};


// Get a block by ID
exports.getCodeBlockById = async (req, res) => {
    try{
        const codeBlock = await CodeBlock.findById(req.params.id);

        if(!codeBlock) {
            return res.status(404).json({message: 'Code block not found'});
        }

        res.json(codeBlock);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// Create default code blocks 
exports.createInitialCodeBlocks = async (req, res) => {
    try{
        const count = await CodeBlock.countDocuments();

        if(count==0){

            const initialCodeBlocks = [
                {
                    title:'Asynchronous case',
                    initialCode:'async function fetchData() { \n    // Write your answer here \n}',
                    solution:'async function fetchData() {\n  try {\n    const response = await fetch(\'https://api.example.com/data\');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error(\'Error fetching data:\', error);\n  }\n}',
                    description: 'Complete the asynchronous function to make an API request'
                },
                {
                    title: 'Javascript Loops',
                    initialCode: 'function sumArray(arr) { \n    // Write your answer here \n}',
                    solution: 'function sumArray(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}',
                    description: 'Complete the function to sum all the elements in an array'
                },
                {
                    title: 'Javascript Objects',
                    initialCode: 'function mergeObjects(obj1, obj2) { \n    // Write your answer here \n}',
                    solution: 'function mergeObjects(obj1, obj2) {\n  return {...obj1, ...obj2};\n}',
                    description: 'Complete the function to merge the objects'
                },
                {
                    title: 'Javascript Arrays',
                    initialCode: 'function filterAndDouble(numbers) { \n    // Write your answer here \n}',
                    solution: 'function filterAndDouble(numbers) {\n  return numbers.filter(num => num % 2 === 0).map(num => num * 2);\n}',
                    description: 'Complete the function to filter even numbers and double them'
                },
            ];
            await CodeBlock.insertMany(initialCodeBlocks);
            console.log('Default code blocks created');    
        }
    } catch (error) {
        console.error('Error creating default code blocks:', error);
    }
};