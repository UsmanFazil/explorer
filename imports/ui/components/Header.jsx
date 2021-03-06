import React,{ Component } from 'react';
import { HTTP } from 'meteor/http'
import {Badge,Navbar,NavbarBrand,UncontrolledDropdown,DropdownToggle,DropdownMenu,DropdownItem} from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();
export default class Header extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            networks: ""
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        }, ()=>{
            // console.log(this.state.isOpen);
        });
    }

  handleLanguageSwitch = (lang, e) => {
      i18n.setLocale(lang)
  }

  componentDidMount(){
      let url = Meteor.settings.public.networks
      if (!url) return
      try{
          HTTP.get(url, null, (error, result) => {
              if (result.statusCode == 200){
                  let networks = JSON.parse(result.content);
                  if (networks.length > 0){
                      this.setState({
                          networks: <DropdownMenu>{
                              networks.map((network, i) => {
                                  return <span key={i}>
                                      <DropdownItem header><img src={network.logo} /> {network.name}</DropdownItem>
                                      {network.links.map((link, k) => {
                                          return <DropdownItem key={k} disabled={link.chain_id == Meteor.settings.public.chainId}>
                                              <a href={link.url} target="_blank">{link.chain_id} <Badge size="xs" color="secondary">{link.name}</Badge></a>
                                          </DropdownItem>})}
                                      {(i < networks.length - 1)?<DropdownItem divider />:''}
                                  </span>

                              })
                          }</DropdownMenu>
                      })
                  }
              }
          })
      }
      catch(e){
          console.warn(e);
      }
  }

  render() {
      return (
          <Navbar className="background" dark expand="lg" fixed="top" id="header">
              <NavbarBrand tag={Link} to="/"><img src="/img/ColorWhiteplatform1.png" className="img-fluid logo"/></NavbarBrand>
              <UncontrolledDropdown className="d-inline text-nowrap">
                  <DropdownToggle caret={(this.state.networks !== "")} tag="span" size="sm" id="network-nav">{Meteor.settings.public.chainId}</DropdownToggle>
                  {this.state.networks}
              </UncontrolledDropdown>
              <SearchBar id="header-search" history={this.props.history} />
              
              {/* <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav className="ml-auto text-nowrap" navbar>
                      <NavItem>
                          <NavLink tag={Link} to="/validators"><T>navbar.validators</T></NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink tag={Link} to="/blocks"><T>navbar.blocks</T></NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink tag={Link} to="/transactions"><T>navbar.transactions</T></NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink tag={Link} to="/proposals"><T>navbar.proposals</T></NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink tag={Link} to="/voting-power-distribution"><T>navbar.votingPower</T></NavLink>
                      </NavItem> */}
                      {/* <NavItem>
                          <UncontrolledDropdown inNavbar>
                              <DropdownToggle nav caret>
                                  <T>navbar.lang</T>
                              </DropdownToggle>
                              <DropdownMenu right>
                                  <DropdownItem onClick={(e) => this.handleLanguageSwitch('en-US', e)}><T>navbar.english</T></DropdownItem>
                                  <DropdownItem onClick={(e) => this.handleLanguageSwitch('zh-Hant', e)}><T>navbar.chinese</T></DropdownItem>
                                  <DropdownItem onClick={(e) => this.handleLanguageSwitch('zh-Hans', e)}><T>navbar.simChinese</T></DropdownItem>
                              </DropdownMenu>
                          </UncontrolledDropdown>
                      </NavItem> */}
                  {/* </Nav>
              </Collapse> */}
          </Navbar>
      );
  }
}