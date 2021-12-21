export default {
    name: 'intersection',
    mounted(el, binding){

        const options = {
          rootMargin: '0px',
          threshold: 1.0
        }

        const owner = binding.arg
        const callback = (entries) =>{
          if(entries[0].isIntersecting){
            binding.value(owner)
          }
        }

        const observer =  new IntersectionObserver(callback, options)
        observer.observe(el)
    },
}