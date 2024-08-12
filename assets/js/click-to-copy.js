let codeListings = document.querySelectorAll('.highlight > pre');

for (let index = 0; index < codeListings.length; index++)
{
    const codeSample = codeListings[index].querySelector('code');
    const copyButton = document.createElement("button");
    copyButton.setAttribute('type', 'button');
    copyButton.onclick = function() { copyCode(codeSample, copyButton); };
    copyButton.classList.add('code-copy'); 
    copyButton.setAttribute('data-toggle', 'tooltip');
    copyButton.setAttribute('title', 'Copy to clipboard');
    copyButton.innerHTML = '<i class="fa fa-copy"></i>';
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('click-to-copy');
    buttonDiv.append(copyButton);
    codeListings[index].insertBefore(buttonDiv, codeSample);
    new bootstrap.Tooltip(copyButton);
}
function copyCode(codeSample, button)
{
    navigator.clipboard.writeText(codeSample.textContent.trim());
    const tooltipInstance = bootstrap.Tooltip.getInstance(button);
    tooltipInstance.setContent({ '.tooltip-inner': 'Copied!' });
    tooltipInstance.show();
    setTimeout(() => {
        tooltipInstance.setContent({ '.tooltip-inner': 'Copy to clipboard' });
        tooltipInstance.hide();
    }, 3000);
}
