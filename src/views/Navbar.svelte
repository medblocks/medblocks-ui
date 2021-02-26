<script lang="ts">
  import { link } from "svelte-spa-router";
  let active = false;
</script>

<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" use:link href="/">
      <img
        alt="logo"
        src="data:image/svg+xml;utf8,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd' xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape' width='210mm' height='297mm' viewBox='0 0 210 297' version='1.1' id='svg8' inkscape:version='1.0.1 (3bc2e813f5, 2020-09-07)' sodipodi:docname='medblocks-ui.svg'%3E%3Cdefs id='defs2' /%3E%3Csodipodi:namedview id='base' pagecolor='%23ffffff' bordercolor='%23666666' borderopacity='1.0' inkscape:pageopacity='0.0' inkscape:pageshadow='2' inkscape:zoom='0.35' inkscape:cx='400' inkscape:cy='560' inkscape:document-units='mm' inkscape:current-layer='layer1' inkscape:document-rotation='0' showgrid='false' inkscape:window-width='1920' inkscape:window-height='1017' inkscape:window-x='-8' inkscape:window-y='-8' inkscape:window-maximized='1' /%3E%3Cmetadata id='metadata5'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title /%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg inkscape:label='Layer 1' inkscape:groupmode='layer' id='layer1'%3E%3Crect style='opacity:0.596774;fill:%237ed957;fill-opacity:1;stroke-width:0.554046;stroke-miterlimit:4;stroke-dasharray:none' id='rect833' width='170.52089' height='247.49611' x='0.30238074' y='0.37797341' /%3E%3Crect style='opacity:0.596774;fill:%237ed957;fill-opacity:1;stroke-width:0.554045;stroke-miterlimit:4;stroke-dasharray:none' id='rect833-6' width='170.52089' height='247.49612' x='39.471699' y='48.609081' /%3E%3C/g%3E%3C/svg%3E%0A"
        height="28"
      />
      <span class="brand has-text-weight-bold" style="margin-left: 0.5rem"
        >Medblocks UI</span
      >
    </a>

    <a
      role="button"
      class="navbar-burger"
      aria-label="menu"
      aria-expanded="false"
      on:click={() => {
        active = !active;
      }}
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu" class:is-active={active}>
    <div class="navbar-start">
      <!-- <a class="navbar-item" use:link href="/">
          Visualization
        </a> -->
      <!-- <a class="navbar-item" use:link href="/forms">
          Forms
        </a> -->

      <!-- <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            More
          </a>
  
          <div class="navbar-dropdown">
            <a class="navbar-item">
              About
            </a>
            <a class="navbar-item">
              Jobs
            </a>
            <a class="navbar-item">
              Contact
            </a>
            <hr class="navbar-divider">
            <a class="navbar-item">
              Report an issue
            </a>
          </div>
        </div> -->
    </div>

    <!-- <div class="navbar-end">
      <a class="navbar-item" href="https://github.com/sidharthramesh/medblocks-ui/">
        <span class="icon has-text-grey">
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub icon</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </span>
      </a>
    </div> -->
  </div>
</nav>
