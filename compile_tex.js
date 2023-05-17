const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set the input directory containing .tex files
const inputDirectory = path.join(__dirname, 'eh20-slides');

// Set the output directory for the compiled PDF files
const outputDirectory = path.join(__dirname, 'static/js_slides');

// Set the base directory where the script is located
const baseDirectory = __dirname;

// Function to recursively search for .tex files within a directory
function compileTexFiles(directory) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      compileTexFiles(filePath); // Recursively search within subdirectories
    } else if (path.extname(file) === '.tex') {
      const relativeFilePath = path.relative(inputDirectory, filePath);
      const outputFilePath = path.join(outputDirectory, relativeFilePath.replace('.tex', '.pdf'));

      // Create the output directory if it doesn't exist
      fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });

      // Exclude files from the graphics directory
      if (!filePath.includes('/graphics/')) {
        
        // Compile the .tex file using latexmk and lualatex
        try {
          const command = `latexmk -f -interaction=nonstopmode -lualatex -output-directory="${outputDirectory}" -outdir="${outputDirectory}" "${filePath}"`;//outdir is aux files, alter later
//          const command = `latexmk -f -interaction=nonstopmode slides.tex`
          const options = { cwd: baseDirectory };
          execSync(command, options);
          console.log(`Compilation successful: ${relativeFilePath}`);
          console.log('Output PDF path:', outputFilePath);
        } catch (error) {
          console.error(`Compilation failed: ${relativeFilePath}`);
          console.error(error.stdout.toString());
        }
      }
    }
  });
}

process.env.TEXINPUTS = `${__dirname}/eh20-slides:${process.env.TEXINPUTS || ''}`;

// Call the function to compile .tex files within the input directory
compileTexFiles(inputDirectory);
