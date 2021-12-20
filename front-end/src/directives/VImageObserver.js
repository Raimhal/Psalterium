export default {
    name: 'image-observer',
    mounted(el, binding){

        const options = {
            rootMargin: '0px',
            threshold: 1.0
        }
        const name = binding.arg
        const callback = (entries) =>{
            if(el.src === ""){
                binding.value({target: el, image_name: name})
            }
        }

        const observer =  new IntersectionObserver(callback, options)
        observer.observe(el)
    },
}