
const dragDropBox = document.getElementById('dragDropBox');

dragDropBox.addEventListener('dragenter', handleDragEnter);
dragDropBox.addEventListener('dragover', handleDragOver);
dragDropBox.addEventListener('dragleave', handleDragLeave);
dragDropBox.addEventListener('drop', handleDrop);

function handleDragEnter(event) {
  event.preventDefault();
  dragDropBox.classList.add('highlight');
}
function handleDragOver(event) {
  event.preventDefault();
}

function handleDragLeave(event) {
  event.preventDefault();
  dragDropBox.classList.remove('highlight');
}

function handleDrop(event) {
  event.preventDefault();
  dragDropBox.classList.remove('highlight');
  const files = event.dataTransfer.files;
  
  // Handle the dropped files here
  let text=" "
  console.log(files.length)
  text=files[0].name+", "
  for(let i=1;i<files.length;i++){
    
    text+= " " + files[i].name+", "
  }
  console.log(text)
  document.getElementById("sfiles").innerHTML=text
  document.getElementById("nu").style.display="inline"
  document.getElementById("nu").innerHTML=("("+files.length+")")

}

        var h = window.innerHeight;
        var w = window.innerWidth;
        if (w <= 1200) {
            document.getElementById('main').style.display = "none"
        } else {
            document.getElementById('main').style.display = "block"
        }
        console.log(v)

function backToNormal(){
    document.getElementById('navbar').classList.remove('hide')
    document.getElementById('footer').classList.remove('hide')
    document.getElementById('3rd').classList.remove('hide')
    document.getElementById('1st').classList.remove('hide')
    document.getElementById('mediaCenter').classList.remove('hide')
    document.getElementById('uploadMediaPopup').classList.add('easOut')
    document.getElementById('uploadAssigmentPopup').classList.add('easOut')
    document.getElementById('uploadQuizPopup').classList.add('easOut')
    delay(500)
    
}
function showPopup(){
    document.getElementById('navbar').classList.add('hide')
    document.getElementById('footer').classList.add('hide')
    document.getElementById('3rd').classList.add('hide')
    document.getElementById('1st').classList.add('hide')
    document.getElementById('mediaCenter').classList.add('hide')
    document.getElementById('uploadMediaPopup').style.display = 'block'
    document.getElementById('uploadMediaPopup').classList.remove('easOut')
    const element = document.getElementById('uploadMediaPopup');
    element.classList.add('myClass');


}
function showAssigment(){
    document.getElementById('navbar').classList.add('hide')
    document.getElementById('footer').classList.add('hide')
    document.getElementById('3rd').classList.add('hide')
    document.getElementById('1st').classList.add('hide')
    document.getElementById('mediaCenter').classList.add('hide')
    document.getElementById('uploadAssigmentPopup').style.display = 'block'
    document.getElementById('uploadAssigmentPopup').classList.remove('easOut')
    const element = document.getElementById('uploadAssigmentPopup');
    element.classList.add('myClass');



}
function uploadQuizPopup(){
    document.getElementById('navbar').classList.add('hide')
    document.getElementById('footer').classList.add('hide')
    document.getElementById('3rd').classList.add('hide')
    document.getElementById('1st').classList.add('hide')
    document.getElementById('mediaCenter').classList.add('hide')
    document.getElementById('uploadQuizPopup').style.display = 'block'
    document.getElementById('uploadQuizPopup').classList.remove('easOut')
    const element = document.getElementById('uploadQuizPopup');
    element.classList.add('myClass');


}