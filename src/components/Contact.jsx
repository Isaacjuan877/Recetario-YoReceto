import { FaInstagram, FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
function Contact() {
  return (
    <footer className="relative py-28 text-white overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop)'
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/70" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <h2 className=" text-4xl md:text-6xl font-light uppercase tracking-[4px] mb-16 break-words ">
          RECETARIO
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">

        {/* REDES */}
        <div>

          <h3 className="uppercase text-lg tracking-[3px] mb-8">
            Redes Sociales
          </h3>

          <div className="flex gap-5 flex-wrap">

            <a
              href="#"
              className="
                w-14 h-14 rounded-full
                bg-white/10
                flex items-center justify-center
                hover:bg-red-400
                transition-all duration-300
              "
            >
              <FaInstagram className="text-2xl" />
            </a>

            <a
              href="#"
              className="
                w-14 h-14 rounded-full
                bg-white/10
                flex items-center justify-center
                hover:bg-red-400
                transition-all duration-300
              "
            >
              <FaXTwitter className="text-2xl" />
            </a>

            <a
              href="#"
              className="
                w-14 h-14 rounded-full
                bg-white/10
                flex items-center justify-center
                hover:bg-red-400
                transition-all duration-300
              "
            >
              <FaFacebookF className="text-2xl" />
            </a>

            <a
              href="#"
              className="
                w-14 h-14 rounded-full
                bg-white/10
                flex items-center justify-center
                hover:bg-red-400
                transition-all duration-300
              "
            >
              <FaLinkedinIn className="text-2xl" />
            </a>

          </div>

        </div>

        {/* SOBRE NOSOTROS */}
          <div>

            <h3 className="uppercase text-lg tracking-[3px] mb-8 text-center">
              ¿Qué somos?
            </h3>

            <p className="text-gray-300 leading-relaxed text-[15px] text-center">

              Recetario Yo Receto es una plataforma web
              dedicada a descubrir, guardar y explorar
              recetas de cocina de diferentes partes del
              mundo. Nuestro objetivo es ayudarte a
              encontrar inspiración culinaria de manera
              rápida, moderna y sencilla.

            </p>

          </div>

        {/* CONTACTO */}
        <div>

          <h3 className="uppercase text-lg tracking-[3px] mb-8">
            Contacto
          </h3>

          <div className="space-y-5 text-gray-300 break-words">

            <p className="hover:text-white transition-all">
              recetario-yoreceto@recetario.com
            </p>

            <p className="hover:text-white transition-all">
              +57 300 000 0000
            </p>

          </div>

        </div>

      </div>

        {/* FOOTER BOTTOM */}
        <div className="border-t border-white/20 mt-20 pt-8 flex flex-col md:flex-row justify-between gap-4 text-gray-400 text-sm">

          <p>
            © 2026 Recetario. Todos los derechos reservados.
          </p>

          <div className="flex gap-6">

            <button className="hover:text-white transition-all">
              Privacidad
            </button>

            <button className="hover:text-white transition-all">
              Términos
            </button>

          </div>

        </div>

      </div>

    </footer>
  )
}

export default Contact