<script lang="ts">
    import {link} from 'svelte-spa-router'
    let active = false
</script>

<nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" use:link href="/">
        <img src="data:image/svg+xml;utf8,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd' xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape' width='210mm' height='297mm' viewBox='0 0 210 297' version='1.1' id='svg8' inkscape:version='1.0.1 (3bc2e813f5, 2020-09-07)' sodipodi:docname='medblocks-ui.svg'%3E%3Cdefs id='defs2' /%3E%3Csodipodi:namedview id='base' pagecolor='%23ffffff' bordercolor='%23666666' borderopacity='1.0' inkscape:pageopacity='0.0' inkscape:pageshadow='2' inkscape:zoom='0.35' inkscape:cx='400' inkscape:cy='560' inkscape:document-units='mm' inkscape:current-layer='layer1' inkscape:document-rotation='0' showgrid='false' inkscape:window-width='1920' inkscape:window-height='1017' inkscape:window-x='-8' inkscape:window-y='-8' inkscape:window-maximized='1' /%3E%3Cmetadata id='metadata5'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title /%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg inkscape:label='Layer 1' inkscape:groupmode='layer' id='layer1'%3E%3Crect style='opacity:0.596774;fill:%237ed957;fill-opacity:1;stroke-width:0.554046;stroke-miterlimit:4;stroke-dasharray:none' id='rect833' width='170.52089' height='247.49611' x='0.30238074' y='0.37797341' /%3E%3Crect style='opacity:0.596774;fill:%237ed957;fill-opacity:1;stroke-width:0.554045;stroke-miterlimit:4;stroke-dasharray:none' id='rect833-6' width='170.52089' height='247.49612' x='39.471699' y='48.609081' /%3E%3C/g%3E%3C/svg%3E%0A" height="28">
        <span class="brand has-text-weight-bold" style="margin-left: 0.5rem">Medblocks UI</span>
      </a>
  
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" on:click={()=>{active = !active}}>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
  
    <div id="navbarBasicExample" class="navbar-menu" class:is-active={active}>
      <div class="navbar-start">
        <a class="navbar-item" use:link href="/">
          Data Entry
        </a>
        <!-- <a class="navbar-item" use:link href="/">
          Visualization
        </a> -->
        <a class="navbar-item" use:link href="/settings">
          Settings
        </a>
  
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
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light">
              Log in
            </a>
          </div>
        </div>
      </div> -->
    </div>
  </nav>