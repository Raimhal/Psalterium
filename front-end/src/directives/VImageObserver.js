export default {
    name: 'image-observer',
    mounted(el, binding){

        const options = {
            rootMargin: '0px',
            threshold: 1.0
        }
        const callback = (entries) =>{
            if(entries[0].isIntersecting && el.src === ""){
                console.log('rise')
                binding.value(el, binding.arg)
            }
        }

        const observer =  new IntersectionObserver(callback, options)
        observer.observe(el)
    },
}